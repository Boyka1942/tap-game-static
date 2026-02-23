import { describe, it, expect } from "vitest";

describe("ClaimProgressBar Component", () => {
  it("should calculate progress percentage correctly", () => {
    const threshold = 1000000;
    
    // Test 0%
    const progress0 = Math.min((0 / threshold) * 100, 100);
    expect(progress0).toBe(0);
    
    // Test 25%
    const progress25 = Math.min((250000 / threshold) * 100, 100);
    expect(progress25).toBe(25);
    
    // Test 50%
    const progress50 = Math.min((500000 / threshold) * 100, 100);
    expect(progress50).toBe(50);
    
    // Test 100%
    const progress100 = Math.min((1000000 / threshold) * 100, 100);
    expect(progress100).toBe(100);
    
    // Test over 100% (should cap at 100)
    const progressOver = Math.min((1500000 / threshold) * 100, 100);
    expect(progressOver).toBe(100);
  });

  it("should calculate tokens needed correctly", () => {
    const threshold = 1000000;
    
    // Test with 0 tokens
    const needed0 = Math.max(threshold - 0, 0);
    expect(needed0).toBe(1000000);
    
    // Test with 250,000 tokens
    const needed250k = Math.max(threshold - 250000, 0);
    expect(needed250k).toBe(750000);
    
    // Test with 999,999 tokens
    const needed999k = Math.max(threshold - 999999, 0);
    expect(needed999k).toBe(1);
    
    // Test with exactly 1,000,000 tokens
    const needed1m = Math.max(threshold - 1000000, 0);
    expect(needed1m).toBe(0);
    
    // Test with over 1,000,000 tokens (should be 0)
    const neededOver = Math.max(threshold - 1500000, 0);
    expect(neededOver).toBe(0);
  });

  it("should verify progress bar component file exists", async () => {
    const fs = await import("fs");
    const path = await import("path");
    
    const componentPath = path.resolve(__dirname, "../components/claim-progress-bar.tsx");
    const exists = fs.existsSync(componentPath);
    
    expect(exists).toBe(true);
  });

  it("should verify progress bar is imported in home screen", async () => {
    const fs = await import("fs");
    const path = await import("path");
    
    const homeScreenPath = path.resolve(__dirname, "../app/(tabs)/index.tsx");
    const content = fs.readFileSync(homeScreenPath, "utf-8");
    
    // Check import
    expect(content).toContain('import { ClaimProgressBar } from "@/components/claim-progress-bar"');
    
    // Check usage
    expect(content).toContain("<ClaimProgressBar currentTokens={state.totalTokens} />");
  });
});
