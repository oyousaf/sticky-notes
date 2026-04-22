const API_URL = import.meta.env.VITE_API_URL || "http://204.168.141.215:3002";

const db = {
  notes: {
    create: async (payload) => {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return res.json();
    },

    update: async (id, payload) => {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return res.json();
    },

    delete: async (id) => {
      await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
      });

      return { success: true };
    },

    get: async (id) => {
      const res = await fetch(`${API_URL}/api/notes/${id}`);
      return res.json();
    },

    list: async () => {
      const res = await fetch(`${API_URL}/api/notes`);
      return res.json();
    },
  },
};

export { db };
