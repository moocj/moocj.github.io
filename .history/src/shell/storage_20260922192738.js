// Store information for the desktop between visits. 

const KEY = "portfolio.desktop"

const NOTHING = { open: false, app: null }; 

export function createStorage(store) {
    function read() {
        try {
            const raw = store.getItem(KEY); 
            if (raw === null) return {...NOTHING}; 

            const saved = JSON.parse(raw);
            return {
                open: saved.open === true,
                app: typeof saved.app === "string" ? saved.app : null,
            };
        } catch {
            return {...NOTHING}
        }
    }

    function write(state){
        try {
            store.setItem(KEY, JSON.stringify({ open: state.open === true, app: state.app ?? null }));
        } catch {
            // don't need to do anything if it doesn't remember 
        }
    }
}