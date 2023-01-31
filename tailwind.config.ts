import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>> {
  theme: {
    extend: {
      spacing: {
        "1/5": "20%",
      }
    }
  }
}
