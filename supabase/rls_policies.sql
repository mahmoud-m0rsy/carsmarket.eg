-- Apply in the Supabase SQL editor. Frontend code cannot bypass Postgres RLS.
alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
drop policy if exists "CarsMarket admin can insert products" on public.products;
drop policy if exists "CarsMarket admin can update products" on public.products;
drop policy if exists "CarsMarket admin can delete products" on public.products;

create policy "Public can read products"
  on public.products for select
  using (true);

create policy "CarsMarket admin can insert products"
  on public.products for insert
  with check (lower(auth.jwt() ->> 'email') = 'carsmarketeg2@gmail.com');

create policy "CarsMarket admin can update products"
  on public.products for update
  using (lower(auth.jwt() ->> 'email') = 'carsmarketeg2@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'carsmarketeg2@gmail.com');

create policy "CarsMarket admin can delete products"
  on public.products for delete
  using (lower(auth.jwt() ->> 'email') = 'carsmarketeg2@gmail.com');
