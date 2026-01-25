// cookie.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cookie = {
  /**
   * Set a cookie
   * @param {string} name
   * @param {string} value
   * @param {object} options - optional { expires: Date }
   */
  set: async (name, value, options = {}) => {
    try {
      const cookie = {
        value,
        expires: options.expires ? options.expires.toISOString() : null,
      };
      await AsyncStorage.setItem(`cookie_${name}`, JSON.stringify(cookie));
      console.log(`Cookie set: ${name}=${value}`);
    } catch (err) {
      console.error("Error setting cookie:", err);
    }
  },

  /**
   * Get a cookie
   * @param {string} name
   * @returns {Promise<string|null>}
   */
  get: async (name) => {
    try {
      const cookieStr = await AsyncStorage.getItem(`cookie_${name}`);
      if (!cookieStr) return null;

      const cookie = JSON.parse(cookieStr);

      // Check expiration
      if (cookie.expires && new Date(cookie.expires) < new Date()) {
        await AsyncStorage.removeItem(`cookie_${name}`);
        return null;
      }

      return cookie.value;
    } catch (err) {
      return null;
    }
  },

  /**
   * Remove a cookie
   * @param {string} name
   */
  remove: async (name) => {
    try {
      await AsyncStorage.removeItem(`cookie_${name}`);
      console.log(`Cookie removed: ${name}`);
    } catch (err) {
      console.error("Error removing cookie:", err);
    }
  },

  /**
   * Clear all cookies
   */
  clearAll: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cookieKeys = keys.filter((k) => k.startsWith("cookie_"));
      await AsyncStorage.multiRemove(cookieKeys);
      console.log("All cookies cleared");
    } catch (err) {
      console.error("Error clearing cookies:", err);
    }
  },
};

export default Cookie;
