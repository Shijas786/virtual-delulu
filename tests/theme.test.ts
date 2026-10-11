import { test, expect } from "bun:test";
import { THEMES, ThemeManager } from "../src/theme";
import { Theater, THEATER_THEMES } from "../src/theater";
import { Puppet, PUPPET_THEMES } from "../src/puppet";

test("THEMES defines carnival, space, and rainbow worlds", () => {
  expect(THEMES.carnival).toBeDefined();
  expect(THEMES.space).toBeDefined();
  expect(THEMES.rainbow).toBeDefined();
  expect(THEMES.carnival.theater).toBe("carnival");
  expect(THEMES.space.theater).toBe("space");
  expect(THEMES.rainbow.theater).toBe("rainbow");
});

test("Theater.setTheme updates material colors without errors", () => {
  const theater = new Theater();
  theater.setTheme("space");
  expect(THEATER_THEMES.space.gold).toBe(0x00d2d3);
  theater.setTheme("rainbow");
  expect(THEATER_THEMES.rainbow.gold).toBe(0xffe066);
  theater.setTheme("carnival");
  expect(THEATER_THEMES.carnival.gold).toBe(0xc9a064);
});

test("Puppet.setPuppetTheme mutates theme materials", () => {
  const puppet = new Puppet(PUPPET_THEMES.warm);
  puppet.setPuppetTheme(PUPPET_THEMES.spaceUser);
  puppet.setPuppetTheme(PUPPET_THEMES.rainbowUser);
  puppet.setPuppetTheme(PUPPET_THEMES.carnivalUser);
});
