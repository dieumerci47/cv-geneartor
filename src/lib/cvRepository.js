import { supabase } from "@/supabase/supabase";

export async function upsertCv({ id, title, template, data }) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error("Non authentifié");
  const userId = auth.user.id;

  if (id) {
    const { data: rows, error } = await supabase
      .from("cvs")
      .update({ title, template, data })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return rows;
  } else {
    const { data: rows, error } = await supabase
      .from("cvs")
      .insert([{ user_id: userId, title, template, data }])
      .select()
      .single();
    if (error) throw error;
    return rows;
  }
}

export async function getCv(id) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error("Non authentifié");
  const userId = auth.user.id;

  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function listCvs() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error("Non authentifié");
  const userId = auth.user.id;

  const { data, error } = await supabase
    .from("cvs")
    .select("id,title,template,updated_at,created_at,data")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteCv(id) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error("Non authentifié");
  const userId = auth.user.id;

  const { error } = await supabase
    .from("cvs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
