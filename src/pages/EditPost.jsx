import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
                setStatus(response.data.status);
            } catch (err) {
                setError('Գրառման տվյալները բեռնելիս սխալ առաջացավ:');
            } finally {
                setFetching(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.put(`/posts/${id}`, { title, content, status });
            navigate('/posts');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('Դուք չունեք այս գրառումը խմբագրելու իրավունք (Search դեր):');
            } else if (err.response && err.response.data) {
                setError(err.response.data.message || 'Սերվերի սխալ:');
            } else {
                setError('Կապի սխալ:');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Բեռնվում է...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Գրառման Խմբագրում</h1>
                    <button 
                        onClick={() => navigate('/posts')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                        Հետ գնալ
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Վերնագիր</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Բովանդակություն</label>
                        <textarea
                            required
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Կարգավիճակ</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="draft">Draft (Սևագիր)</option>
                            <option value="published">Published (Հրապարակված)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 disabled:bg-gray-400"
                    >
                        {loading ? 'Պահպանվում է...' : 'Թարմացնել Գրառումը'}
                    </button>
                </form>
            </div>
        </div>
    );
}
