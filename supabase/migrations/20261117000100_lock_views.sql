-- Seguridad: las vistas solo se leen. Quita los permisos de escritura que
-- Supabase concede por defecto a anon/authenticated en el esquema public.
-- (La app lee estas vistas en el servidor con el rol authenticated, nunca por la API web.)
revoke insert, update, delete, truncate, references, trigger
  on public.active_invoice_kinds, public.low_stock_alerts, public.order_balances,
     public.sales_lines, public.staff_directory, public.staff_order_items,
     public.staff_sale_items, public.store_catalog
  from anon, authenticated;

-- El directorio del personal (con correos) nunca lo lee un visitante anónimo.
revoke all on public.staff_directory from anon;
