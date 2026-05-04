import { useEffect, useState } from "react";

export default function Kitoblar() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetch("https://kutubxona-uz-7l39.onrender.com/api/v1/book")
            .then(r => r.json())
            .then(r => {
                setBooks(r.data || []);
                setFilteredBooks(r.data || []);
            })
            .catch(err => console.error(err));
    }, []);

    // Filtrlash
    useEffect(() => {
        let result = [...books];

        // Qidiruv
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(book =>
                book.title?.toLowerCase().includes(term) ||
                book.author?.toLowerCase().includes(term)
            );
        }

        // Kategoriya filtri (hozircha API da yo'q bo'lsa ham tayyor)
        if (categoryFilter !== "all") {
            result = result.filter(book => book.category?.toLowerCase() === categoryFilter);
        }

        // Holat filtri
        if (statusFilter === "available") {
            result = result.filter(book => 
                book.status === "available" || book.status === "Bo'sh" || !book.status?.toLowerCase().includes("band")
            );
        } else if (statusFilter === "borrowed") {
            result = result.filter(book => book.status?.toLowerCase().includes("band"));
        }

        // Saralash
        if (sortBy === "title") result.sort((a, b) => a.title?.localeCompare(b.title));
        if (sortBy === "author") result.sort((a, b) => a.author?.localeCompare(b.author));
        if (sortBy === "newest") result.sort((a, b) => (b.id || 0) - (a.id || 0));

        setFilteredBooks(result);
    }, [searchTerm, books, categoryFilter, statusFilter, sortBy]);

    const isAvailable = (book) => 
        book.status === "available" || book.status === "Bo'sh" || !book.status?.toLowerCase().includes("band");

    return (
        <div className="min-h-screen bg-[#F8F5F0]">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl"></div>
                        <span className="text-2xl font-semibold text-gray-800">ZiyoHub</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium hidden sm:block">
                        {books.length} ta kitob
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">
                {/* Sarlavha */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                        Izlash kutubxonasiga xush kelibsiz
                    </h1>
                </div>

                {/* Qidiruv + Kategoriya + Tugma */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Qidiruv input */}
                        <div className="flex relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Kitob nomi yoki muallif kiriting..."
                                className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-amber-600"
                            />
                        </div>

                                                {/* Izlash tugmasi */}
                        <button 
                            className="h-14 px-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl transition-all active:scale-95 whitespace-nowrap"
                        >
                            Izlash
                        </button>

                        {/* Kategoriya */}
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-600 text-base"
                        >
                            <option value="all">Barcha kategoriyalar</option>
                            <option value="roman">Roman</option>
                            <option value="sheriyat">She'riyat</option>
                            <option value="tarix">Tarix</option>
                            <option value="diniy">Diniy</option>
                            <option value="ilmiy">Ilmiy</option>
                        </select>

                        {/* Holat */}
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-600"
                        >
                            <option value="all">Barchasi</option>
                            <option value="available">Bo'sh</option>
                            <option value="borrowed">Band</option>
                        </select>

                                        <div className="flex justify-end mb-8">
                    <select 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-xl px-5 h-14 bg-white"
                    >
                        <option value="title">Nomi bo‘yicha</option>
                        <option value="author">Muallif bo‘yicha</option>
                        <option value="newest">Yangi kitoblar</option>
                    </select>
                </div>


                    </div>
                </div>

                {/* Saralash */}


                {/* Kitob Kartalari - Kattalashtirilgan */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                    {filteredBooks.map((book) => (
                        <div 
                            key={book.id} 
                            onClick={() => setSelectedBook(book)}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="relative bg-[#F5F0E8] aspect-[8/10] flex justify-center items-center border-b overflow-hidden">
                                <img 
                                    src={book.image || "https://via.placeholder.com/300x420?text=Kitob"} 
                                    alt={book.title}
                                    className="h-[92%] object-contain shadow-md group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className={`absolute top-4 right-4 px-3.5 py-1 rounded-full text-xs font-medium shadow-md ${isAvailable(book) ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                    {isAvailable(book) ? "✓ Bo'sh" : "Band"}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-2 text-gray-900">
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
                    <div className="text-center py-20 text-gray-500 text-xl">
                        😔 Hech qanday kitob topilmadi
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedBook && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl max-w-lg sm:max-w-2xl w-full max-h-[95vh] overflow-auto">
                        <div className="p-6 sm:p-8">
                            <button onClick={() => setSelectedBook(null)} className="float-right text-4xl text-gray-400 hover:text-gray-700">×</button>
                            
                            <div className="flex flex-col sm:flex-row gap-8 mt-4">
                                <img 
                                    src={selectedBook.image || "https://via.placeholder.com/300x420?text=Kitob"} 
                                    alt={selectedBook.title}
                                    className="w-full sm:w-72 rounded-2xl shadow-lg"
                                />
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-3">{selectedBook.title}</h2>
                                    <p className="text-xl text-gray-600 mb-6">{selectedBook.author}</p>
                                    <p><strong>Holati:</strong> 
                                        <span className={isAvailable(selectedBook) ? "text-emerald-600" : "text-rose-600"}>
                                            {isAvailable(selectedBook) ? " Bo'sh" : " Band"}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}