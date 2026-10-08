import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from("recipes")
    .select("content")
    .eq("id", "2197a232-6dbf-4ac3-a2bf-8f75d93343c5")
    .single();

  if (error) console.error(error);
  else console.log(JSON.stringify(data.content, null, 2));
}

run();
