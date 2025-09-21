/**
 * Add admin permission checks to all admin pages
 */

const fs = require('fs')
const path = require('path')

const adminPages = [
  'app/admin/users/page.tsx',
  'app/admin/chapters/new/page.tsx',
  'app/admin/questions/new/page.tsx',
  'app/admin/slides/new/page.tsx',
  'app/admin/chapters/[id]/edit/page.tsx',
  'app/admin/slides/[id]/edit/page.tsx',
  'app/admin/questions/[id]/edit/page.tsx',
]

adminPages.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`)
    return
  }

  let content = fs.readFileSync(fullPath, 'utf-8')

  // Check if already has requireAdmin
  if (content.includes('requireAdmin')) {
    console.log(`Skipping ${filePath} - already has requireAdmin`)
    return
  }

  // Add import statement if not present
  if (!content.includes("import { requireAdmin } from '@/lib/auth/admin'")) {
    // Find the last import statement
    const importRegex = /import .* from .*/g
    const imports = content.match(importRegex) || []
    const lastImport = imports[imports.length - 1]

    if (lastImport) {
      const lastImportIndex = content.lastIndexOf(lastImport)
      const insertIndex = lastImportIndex + lastImport.length
      content = content.slice(0, insertIndex) + "\nimport { requireAdmin } from '@/lib/auth/admin'" + content.slice(insertIndex)
    }
  }

  // Add requireAdmin call at the beginning of the function
  const functionRegex = /export default async function \w+\(\) \{/
  const match = content.match(functionRegex)

  if (match) {
    const insertIndex = content.indexOf(match[0]) + match[0].length
    content = content.slice(0, insertIndex) + "\n  // Check admin permission\n  await requireAdmin()\n" + content.slice(insertIndex)

    fs.writeFileSync(fullPath, content)
    console.log(`✅ Updated ${filePath}`)
  } else {
    console.log(`⚠️ Could not find function in ${filePath}`)
  }
})

console.log('\n✅ Admin permission checks added to all admin pages')
console.log('\nNext steps:')
console.log('1. Apply the database migration in Supabase Dashboard')
console.log('2. Set at least one user as admin using: UPDATE users_profile SET role = \'admin\' WHERE id = \'USER_ID\'')
console.log('3. Test the admin panel access with both admin and non-admin users')