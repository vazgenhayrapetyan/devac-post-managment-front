import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const navigate = useNavigate();

    // Ֆունկցիա՝ բեքենդից գրառումները բեռնելու համար
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/posts', {
                params: {
                    search: search || undefined,
                    status: status || undefined,
                    page: page
                }
            });
            setPosts(response.data && response.data.data);
            setMeta(response.data);
        } catch (err) {
            console.error("Գրառումները բեռնելիս սխալ առաջացավ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, status]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPosts();
    };

    const handleLogout = () => {
        sessionStorage.removeItem('auth_token');
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս գրառումը:')) {
            try {
                await api.delete(`/posts/${id}`);
                alert('Գրառումը հաջողությամբ ջնջվեց:');
                fetchPosts(); // Թարմացնում ենք ցանկը
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    alert('Դուք չունեք ջնջելու իրավունք (Միայն Admin-ը կարող է ջնջել):');
                } else {
                    alert('Ջնջելիս սխալ առաջացավ:');
                }
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm print:hidden">
                <h1 className="text-2xl font-bold text-gray-800">Գրառումների Կառավարում</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate('/posts/create')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
                    >
                        + Ավելացնել Գրառում
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                        Դուրս Գալ
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 print:hidden">
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Որոնում</label>
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Փնտրել ըստ վերնագրի..." 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ստատուս</label>
                        <select 
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Բոլորը</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition"
                    >
                        Որոնել
                    </button>

                    <div className="flex gap-2">
                        <button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition"
                        >
                            Որոնել
                        </button>
                        <button 
                            type="button"
                            onClick={handlePrint}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-medium transition flex items-center gap-1"
                        >
                            🖨️ Տպել
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Բեռնվում է...</div>
                ) : posts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Գրառումներ չեն գտնվել:</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Վերնագիր</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Հեղինակ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ստատուս</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ստեղծվել է</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Գործողություններ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.user?.name || 'Անհայտ'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('hy-AM')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                        <button
                                            onClick={() => navigate(`/posts/edit/${post.id}`)}
                                            className="text-blue-600 hover:text-blue-900 print:hidden"
                                        >
                                            Խմբագրել
                                        </button>
                                        <span>|</span>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 hover:text-red-900 print:hidden"
                                        >
                                            Ջնջել
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}


                {/* Էջերի Նավարկում (Pagination Controls) */}
                {meta && meta.last_page > 1 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="bg-white border border-gray-300 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Նախորդ
                        </button>
                        <span className="text-sm text-gray-600">
                            Էջ {page} / {meta.last_page}
                        </span>
                        <button 
                            disabled={page === meta.last_page}
                            onClick={() => setPage(page + 1)}
                            className="bg-white border border-gray-300 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Հաջորդ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
