// Import
const { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler, 
    editBookByIdHandler, 
    deleteBookByIdHandler,
 } = require('./handler');

const routes = [
    // Menjalankan fungsi untuk menyimpan data buku
    {
      method: 'POST',
      path: '/books',
      handler: addBookHandler,
    },
    // Menjalankan fungsi untuk menampilkan seluruh data buku
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    // Menjalankan fungsi untuk menampilkan detail data buku
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookByIdHandler,
    },
    // Menjalankan fungsi untuk mengubah data buku
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler,
    },
    // Menjalankan fungsi untuk menghapus data buku
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler,
    },
];

// Export
module.exports = routes;