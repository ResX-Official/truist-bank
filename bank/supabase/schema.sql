-- ============================================================
-- Trust Bank — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text not null,
  avatar_url text,
  phone text,
  address text,
  country text default 'US',
  role text default 'user' check (role in ('user', 'admin')),
  kyc_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ACCOUNTS
-- ============================================================
create table if not exists accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  account_number text unique not null,
  iban text unique,
  account_type text not null check (account_type in ('checking', 'savings', 'investment', 'business')),
  currency text default 'USD',
  balance decimal(15,2) default 0,
  name text not null,
  is_primary boolean default false,
  status text default 'active' check (status in ('active', 'frozen', 'closed')),
  created_at timestamptz default now()
);

-- ============================================================
-- CARDS (store last four only — never full card numbers)
-- ============================================================
create table if not exists cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  account_id uuid references accounts(id),
  cardholder_name text not null,
  last_four text not null,
  expiry_month integer not null,
  expiry_year integer not null,
  card_type text not null check (card_type in ('visa', 'mastercard', 'amex', 'discover')),
  nickname text,
  is_frozen boolean default false,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  account_id uuid references accounts(id),
  type text not null check (type in ('deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'payment', 'refund')),
  amount decimal(15,2) not null,
  currency text default 'USD',
  description text,
  merchant text,
  category text,
  status text default 'completed' check (status in ('pending', 'completed', 'failed', 'flagged')),
  reference_id text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text default 'info' check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- AUDIT LOG (admin balance edits)
-- ============================================================
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references profiles(id) not null,
  target_user_id uuid references profiles(id),
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- AUTO-CREATE PROFILE + ACCOUNTS ON SIGNUP
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  acct_num text;
  acct_num2 text;
begin
  -- Generate random account numbers
  acct_num := lpad((floor(random() * 9000000000) + 1000000000)::text, 10, '0');
  acct_num2 := lpad((floor(random() * 9000000000) + 1000000000)::text, 10, '0');

  -- Create profile
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );

  -- Create checking account
  insert into public.accounts (user_id, account_number, account_type, currency, balance, name, is_primary)
  values (new.id, acct_num, 'checking', 'USD', 0, 'Main Checking', true);

  -- Create savings account
  insert into public.accounts (user_id, account_number, account_type, currency, balance, name)
  values (new.id, acct_num2, 'savings', 'USD', 0, 'Savings');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update all profiles" on profiles for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Accounts
alter table accounts enable row level security;
create policy "Users can view own accounts" on accounts for select using (auth.uid() = user_id);
create policy "Admins can view all accounts" on accounts for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update all accounts" on accounts for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "System can update accounts" on accounts for update using (auth.uid() = user_id);
create policy "System can insert accounts" on accounts for insert with check (auth.uid() = user_id);

-- Cards
alter table cards enable row level security;
create policy "Users can view own cards" on cards for select using (auth.uid() = user_id);
create policy "Users can insert own cards" on cards for insert with check (auth.uid() = user_id);
create policy "Users can update own cards" on cards for update using (auth.uid() = user_id);
create policy "Users can delete own cards" on cards for delete using (auth.uid() = user_id);
create policy "Admins can view all cards" on cards for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Transactions
alter table transactions enable row level security;
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Admins can view all transactions" on transactions for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update transactions" on transactions for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Notifications
alter table notifications enable row level security;
create policy "Users can manage own notifications" on notifications for all using (auth.uid() = user_id);

-- Audit Logs
alter table audit_logs enable row level security;
create policy "Admins can view audit logs" on audit_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can insert audit logs" on audit_logs for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- SERVICE ROLE POLICIES (for admin server-side operations)
-- ============================================================
-- Note: Service role bypasses RLS by default. The above policies
-- apply to the anon and authenticated roles only.

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Transfer money between users (called via RPC)
create or replace function transfer_between_users(
  p_from_account_id uuid,
  p_to_email text,
  p_amount decimal,
  p_note text default null
) returns jsonb language plpgsql security definer as $$
declare
  v_sender_user_id uuid;
  v_sender_balance decimal;
  v_recipient_user_id uuid;
  v_recipient_account_id uuid;
  v_tx_out_id uuid;
  v_tx_in_id uuid;
begin
  -- Get sender info
  select user_id, balance into v_sender_user_id, v_sender_balance
  from accounts where id = p_from_account_id and status = 'active';

  if not found then
    return jsonb_build_object('success', false, 'error', 'Source account not found or frozen');
  end if;

  -- Verify caller owns the account
  if v_sender_user_id != auth.uid() then
    return jsonb_build_object('success', false, 'error', 'Unauthorized');
  end if;

  -- Check sufficient balance
  if v_sender_balance < p_amount then
    return jsonb_build_object('success', false, 'error', 'Insufficient funds');
  end if;

  -- Find recipient
  select id into v_recipient_user_id from profiles where email = p_to_email;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Recipient not found');
  end if;

  if v_recipient_user_id = v_sender_user_id then
    return jsonb_build_object('success', false, 'error', 'Cannot transfer to yourself');
  end if;

  -- Get recipient primary account
  select id into v_recipient_account_id
  from accounts where user_id = v_recipient_user_id and is_primary = true and status = 'active'
  limit 1;

  if not found then
    select id into v_recipient_account_id
    from accounts where user_id = v_recipient_user_id and status = 'active'
    limit 1;
  end if;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Recipient has no active account');
  end if;

  -- Deduct from sender
  update accounts set balance = balance - p_amount where id = p_from_account_id;

  -- Credit recipient
  update accounts set balance = balance + p_amount where id = v_recipient_account_id;

  -- Create outgoing transaction
  insert into transactions (user_id, account_id, type, amount, currency, description, status)
  values (v_sender_user_id, p_from_account_id, 'transfer_out', p_amount, 'USD',
    coalesce(p_note, 'Transfer to ' || p_to_email), 'completed')
  returning id into v_tx_out_id;

  -- Create incoming transaction
  insert into transactions (user_id, account_id, type, amount, currency, description, reference_id, status)
  values (v_recipient_user_id, v_recipient_account_id, 'transfer_in', p_amount, 'USD',
    coalesce(p_note, 'Transfer from ' || (select email from profiles where id = v_sender_user_id)),
    v_tx_out_id::text, 'completed')
  returning id into v_tx_in_id;

  -- Update reference on outgoing
  update transactions set reference_id = v_tx_in_id::text where id = v_tx_out_id;

  return jsonb_build_object('success', true, 'tx_id', v_tx_out_id);
end;
$$;
