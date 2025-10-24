#!/bin/bash

echo "🔒 Kid Bridge Security Audit Starting..."
echo "============================================"

# Dependencies vulnerability check
echo "📦 Checking for vulnerable dependencies..."
pnpm audit

# TypeScript strict checking
echo "📝 TypeScript strict mode compilation..."
npx tsc --noEmit --strict

# ESLint security rules
echo "🔍 Running ESLint security checks..."
npx eslint src/ --ext .ts

# Check for common security anti-patterns
echo "🚫 Checking for security anti-patterns..."
grep -r "console.log" src/ && echo "⚠️  Warning: console.log found in source code" || echo "✅ No console.log statements found"
grep -r "process.env" src/ | grep -v "configService.get" && echo "⚠️  Warning: Direct process.env usage found" || echo "✅ Environment variables accessed safely"
grep -r "eval\|Function\|setTimeout.*string\|setInterval.*string" src/ && echo "❌ Error: Code injection vulnerabilities found" || echo "✅ No code injection patterns found"

# Check for hardcoded secrets (basic patterns)
echo "🔐 Checking for hardcoded secrets..."
grep -r "password\s*=\s*[\"'].*[\"']\|secret\s*=\s*[\"'].*[\"']\|token\s*=\s*[\"'].*[\"']" src/ && echo "❌ Error: Potential hardcoded secrets found" || echo "✅ No hardcoded secrets detected"

# Check database connection security
echo "🗄️  Checking database configuration..."
if grep -q "sqlite" prisma/schema.prisma; then
    echo "⚠️  Warning: SQLite detected - ensure this is not used in production"
else
    echo "✅ Production-ready database configured"
fi

# Check CORS configuration
echo "🌐 Checking CORS configuration..."
grep -A 10 "enableCors" src/main.ts && echo "✅ CORS configuration found"

echo "============================================"
echo "🔒 Security Audit Completed"
echo "Please review any warnings or errors above"