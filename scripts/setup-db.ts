
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/001_initial.sql')
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  console.log('Running database migration...')
  const { error } = await supabase.rpc('exec_sql', { sql })

  if (error) {
    console.error('Migration error:', error)
    // Try running statements individually
    const statements = sql.split(';').filter(s => s.trim())
    for (const statement of statements) {
      if (statement.trim()) {
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' })
        if (stmtError) console.warn('Statement error:', stmtError.message, statement.substring(0, 50))
      }
    }
  } else {
    console.log('Migration completed successfully!')
  }
}

runMigration().catch(console.error)
