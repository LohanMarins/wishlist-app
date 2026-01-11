import { supabase } from "../supabase";

export async function getItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addItem(item) {
  const { error } = await supabase.from("items").insert(item);
  if (error) throw error;
}

export async function updateItem(id, updates) {
  const { error } = await supabase
    .from("items")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteItem(id) {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
}

export async function buyItem(id, userId) {
  const { error } = await supabase
    .from("items")
    .update({
      bought_by: userId,
      bought_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deliverItem(id) {
  const { error } = await supabase
    .from("items")
    .update({ delivered: true })
    .eq("id", id);

  if (error) throw error;
}
