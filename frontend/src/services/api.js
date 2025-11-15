const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api/v1';

async function request(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...opts, headers });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw { status: res.status, body: json || text };
    return json;
  } catch (e) {
    if (e instanceof SyntaxError) {
      // plain text response
      if (!res.ok) throw { status: res.status, body: text };
      return text;
    }
    throw e;
  }
}

export async function post(path, body) { return request(path, { method: 'POST', body: JSON.stringify(body) }); }
export async function get(path) { return request(path, { method: 'GET' }); }
export async function patchReq(path, body) { return request(path, { method: 'PATCH', body: JSON.stringify(body) }); }
export async function put(path, body) { return request(path, { method: 'PUT', body: JSON.stringify(body) }); }
export async function del(path) { return request(path, { method: 'DELETE' }); }

export default { post, get, patch: patchReq, put, del };
