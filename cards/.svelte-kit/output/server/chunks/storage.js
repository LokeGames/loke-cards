import localforage from "localforage";
localforage.createInstance({ name: "loke-cards", storeName: "scenes", description: "Scene data storage" });
localforage.createInstance({ name: "loke-cards", storeName: "chapters", description: "Chapter metadata storage" });
localforage.createInstance({ name: "loke-cards", storeName: "drafts", description: "Draft scenes" });
localforage.createInstance({ name: "loke-cards", storeName: "projects", description: "Project metadata" });
