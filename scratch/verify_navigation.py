import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        print("Launching browser...")
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Navigating to http://localhost:8000...")
        await page.goto("http://localhost:8000")
        
        print("Clicking 'Unwrap the Gift'...")
        await page.click("#unwrap-btn")
        
        print("Clicking 'Light Candles'...")
        await page.click("#light-btn")
        
        print("Waiting for candles to light and 'Blow!' button to appear...")
        # The script waits around flames.length * 160 + 500 ms (~1 second)
        await page.wait_for_selector("#blow-btn:not(.hidden)", timeout=5000)
        
        print("Clicking 'Blow!'...")
        await page.click("#blow-btn")
        
        print("Waiting for success message and 'Read Your Letter' button...")
        # After blowing, it waits 280ms + 350ms to trigger success
        await page.wait_for_selector("#cake-success-msg.show", timeout=5000)
        
        next_btn = page.locator("#next-to-letter")
        is_visible = await next_btn.is_visible()
        print(f"Is 'Read Your Letter' button visible? {is_visible}")
        
        if is_visible:
            print("Clicking 'Read Your Letter'...")
            await next_btn.click()
            
            print("Waiting for letter section to become active...")
            await page.wait_for_selector("#letter-section.active", timeout=2000)
            print("Success! Navigated to the letter section.")
        else:
            print("Failed: Button is not visible.")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
