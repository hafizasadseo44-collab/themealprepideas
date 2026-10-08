const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf8");
let supabaseUrl = "";
let supabaseKey = "";
for (const line of env.split("\n")) {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
    supabaseUrl = line.split("=")[1].trim();
  }
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
    supabaseKey = line.split("=")[1].trim();
  }
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
