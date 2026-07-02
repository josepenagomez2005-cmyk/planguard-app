import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://zfikvzjsjwutzpjvzflk.supabase.co",
  "sb_publishable_ByMEm6sXmLsJOFPiceO3Wg_aS4jD2dx"
);

const { data, error } = await supabase.from("proyectos").select("*");

console.log("Proyectos:", data?.length);
console.log("Error:", error);
console.log(JSON.stringify(data, null, 2));