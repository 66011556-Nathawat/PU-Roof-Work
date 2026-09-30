#!/usr/bin/env bash
# PU Roof Works macOS Launcher
cd "$(dirname "$0")"

echo "======================================================================"
echo "   PU Roof Works - Metal Sheet & PU Foam Roof Decision Hub"
echo "======================================================================"
echo ""

if command -v npm &> /dev/null; then
    echo "[*] Node.js & npm detected. Starting local server..."
    # Open browser after a slight delay
    (sleep 2 && open "http://localhost:3000") &
    npm run dev
else
    echo "[*] Opening cloud application in default browser..."
    open "https://pu-roof-works-dashbaord-nathawat48.ai.studio"
fi
