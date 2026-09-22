// Store information for the desktop between visits. 

const KEY = "portfolio.desktop"

const NOTHING = { open: false, app: null }; 

export function createStorage(store) {
    function read() {
        try {
            const raw = store.getItem(KEY); 
            if (raw === null) return {...NOTHING}
        }
    }
}