const API_URL = "http://localhost:5000";

export async function getItems(owner) {
    const res = await fetch(`${API_URL}/items?owner=${owner}`);
    return res.json();
}

export async function addItem(item) {
    const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(item)
    });
    return res.json();
}

export async function buyItem(id, bought_by) {
    const res = await fetch(`${API_URL}/items/${id}/buy`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({bought_by})
    });
    return res.json();
}

export async function deliverItem(id) {
    const res = await fetch(`${API_URL}/items/${id}/deliver`, {method:"POST"});
    return res.json();
}
