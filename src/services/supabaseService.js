import { supabase } from '../lib/supabase'
export const DEFAULT_WHATSAPP_NUMBER = '01122520928'
const requireClient = () => { if (!supabase) throw new Error('Supabase is not configured.'); return supabase }
export async function fetchProducts(category) { const query = requireClient().from('products').select('id,title,description,price,image_url,category,in_stock,created_at').order('created_at', { ascending: false }); const { data, error } = category && category !== 'All' ? await query.eq('category', category) : await query; if (error) throw error; return (data ?? []).map((product) => ({ ...product, name: product.title, image: product.image_url, stock: product.in_stock, price: Number(product.price) })) }
export async function createProduct(product) { const payload = { title: product.title, description: product.description || null, price: Number(product.price), image_url: product.image_url || null, category: product.category, in_stock: Boolean(product.in_stock) }; const { data, error } = await requireClient().from('products').insert(payload).select().single(); if (error) throw error; return data }
export async function updateProduct(id, product) { const payload = { title: product.title, description: product.description || null, price: Number(product.price), image_url: product.image_url || null, category: product.category, in_stock: Boolean(product.in_stock) }; const { data, error } = await requireClient().from('products').update(payload).eq('id', id).select().single(); if (error) throw error; return data }
export async function deleteProduct(id) { const { error } = await requireClient().from('products').delete().eq('id', id); if (error) throw error }
/** Insert only columns used by the public orders table. Keeping this payload explicit
 * prevents cart/UI fields from leaking into PostgREST and causing schema errors. */
export async function createOrder({ user_id = null, customer_name, phone, whatsapp_phone, governorate, address, items, total_price, payment_method = 'Cash on Delivery' }) {
  const payload = {
    customer_name: String(customer_name).trim(),
    user_id,
    phone: String(phone).trim(),
    whatsapp_phone: String(whatsapp_phone || phone).trim(),
    governorate: String(governorate).trim(),
    address: String(address).trim(),
    items: Array.isArray(items) ? items : [],
    total_price: Number(total_price),
    status: 'Pending',
  }
  payload.payment_method = payment_method
  if (!payload.customer_name || !payload.phone || !payload.whatsapp_phone || !payload.governorate || !payload.address) throw new Error('Customer name, phone, governorate, and address are required.')
  if (!Number.isFinite(payload.total_price)) throw new Error('Order total is invalid.')
  const { data, error } = await requireClient().from('orders').insert(payload).select().single()
  if (error) { const wrapped = new Error(error.message || 'Could not save your order.'); wrapped.cause = error; throw wrapped }
  return data
}
export async function fetchOrders() { const { data, error } = await requireClient().from('orders').select('*').order('created_at', { ascending: false }); if (error) throw error; return data ?? [] }
export function subscribeToOrders(callback) { if (!supabase) return () => {}; const channel = supabase.channel(`orders-${Date.now()}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => callback(payload.new)).subscribe(); return () => supabase.removeChannel(channel) }
export async function fetchWhatsappNumber() { if (!supabase) return DEFAULT_WHATSAPP_NUMBER; const { data, error } = await supabase.from('settings').select('whatsapp_number').limit(1).maybeSingle(); if (error) throw error; return data?.whatsapp_number || DEFAULT_WHATSAPP_NUMBER }
export async function saveWhatsappNumber(value) { const number = String(value || '').trim() || DEFAULT_WHATSAPP_NUMBER; const client = requireClient(); const { data: existing, error: readError } = await client.from('settings').select('id').limit(1).maybeSingle(); if (readError) throw readError; const query = existing?.id ? client.from('settings').update({ whatsapp_number: number }).eq('id', existing.id) : client.from('settings').insert({ whatsapp_number: number }); const { data, error } = await query.select('whatsapp_number').single(); if (error) throw error; return data }
export async function uploadProductImage(file) { if (!file) throw new Error('Choose an image first.'); const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9._-]/gi, '-')}`; const client = requireClient(); const { error } = await client.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type }); if (error) throw error; return client.storage.from('product-images').getPublicUrl(path).data.publicUrl }
