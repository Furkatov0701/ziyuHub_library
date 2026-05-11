import { useEffect, useState, useMemo } from "react";

export default function Kitoblar() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [selectedBook, setSelectedBook] = useState(null);

    // Kitoblarni yuklash
    useEffect(() => {
        fetch("https://kutubxona-uz-7l39.onrender.com/api/v1/book")
            .then(r => r.json())
            .then(r => {
                console.log("API dan kelgan kitoblar:", r.data); // Debug uchun
                setBooks(r.data || []);
            })
            .catch(err => console.error(err));
    }, []);

    // Holatni aniq tekshirish
    const isAvailable = (book) => {
        if (!book) return false;
        
        const status = (book.status || "").toString().toLowerCase().trim();
        
        // "Bo'sh" bo'lishi mumkin bo'lgan holatlar
        return status === "bo'sh" || 
               status === "available" || 
               status === "free" || 
               status === "" ||          // status bo'sh bo'lsa ham bo'sh deb hisoblaymiz
               status === "null" ||
               status === "undefined";
    };

    // Filtrlash va saralash
    const filteredBooks = useMemo(() => {
        let result = [...books];

        // Qidiruv
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(book =>
                book.title?.toLowerCase().includes(term) ||
                book.author?.toLowerCase().includes(term)
            );
        }

        // Holat filtri
        if (statusFilter === "available") {
            result = result.filter(book => isAvailable(book));
        } else if (statusFilter === "borrowed") {
            result = result.filter(book => !isAvailable(book));
        }

        // Saralash
        if (sortBy === "title") {
            result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else if (sortBy === "author") {
            result.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
        } else if (sortBy === "newest") {
            result.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        return result;
    }, [books, searchTerm, statusFilter, sortBy]);

    return (
        <div className="min-h-screen bg-[#F8F5F0]">
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-gray-800">ZiyoHub</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        {books.length} ta kitob
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        ZiyoHub kutubxonasiga xush kelibsiz
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Kerakli kitobni toping va mavjudligini aniqlang
                    </p>
                </div>

                {/* Filterlar */}
                <div className="max-w-5xl mx-auto mb-12 flex flex-col lg:flex-row gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Kitob nomi yoki muallif kiriting..."
                        className="flex-1 h-14 px-6 bg-white border border-gray-200 rounded-3xl text-lg focus:outline-none focus:border-amber-600"
                    />

                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-14 px-6 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:border-amber-600"
                    >
                        <option value="all">Barchasi</option>
                        <option value="available">Bo'sh</option>
                        <option value="borrowed">Band</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-14 px-6 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:border-amber-600"
                    >
                        <option value="title">Nomi bo‘yicha</option>
                        <option value="author">Muallif bo‘yicha</option>
                        <option value="newest">Yangi kitoblar</option>
                    </select>
                </div>

                {/* Kitoblar Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredBooks.map((book) => (
                        <div 
                            key={book.id} 
                            onClick={() => setSelectedBook(book)}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="relative bg-[#F5F0E8] aspect-[3/4] flex items-center justify-center overflow-hidden">
                                {book.image_url || book.image ? (
                                    <img 
                                        src={book.image_url || book.image} 
                                        alt={book.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="text-7xl opacity-30"></div>
                                )}

                                <div className={`absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-semibold shadow-md
                                    ${isAvailable(book) ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                    {isAvailable(book) ? "Bo'sh" : "Band"}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-semibold text-[15.5px] leading-tight line-clamp-2 mb-2">
                                    {book.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-1">
                                    {book.author || "Muallif noma'lum"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-400">😔 Hech qanday kitob topilmadi</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedBook && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-auto">
                        <div className="p-8">
                            <button onClick={() => setSelectedBook(null)} className="float-right text-4xl text-gray-400 hover:text-gray-700">×</button>
                            
                            <div className="flex flex-col md:flex-row gap-8 mt-6">
                                <img 
                                    src={selectedBook.image_url || selectedBook.image || "https://via.placeholder.com/400x520?text=Kitob"} 
                                    alt={selectedBook.title}
                                    className="w-full md:w-80 rounded-2xl shadow-lg"
                                />
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-3">{selectedBook.title}</h2>
                                    <p className="text-xl text-gray-600 mb-6">{selectedBook.author}</p>
                                    
                                    <div className="mb-6">
                                        <span className="font-medium">Holati: </span>
                                        <span className={`font-semibold ${isAvailable(selectedBook) ? "text-emerald-600" : "text-rose-600"}`}>
                                            {isAvailable(selectedBook) ? " Bo'sh" : " Band"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}