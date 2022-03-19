const { nanoid } = require('nanoid');
const books = require('./books');

// Fungsi untuk menyimpan data buku
const addBookHandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
    } = request.payload;
    
    // Filtering jika client tidak melampirkan properti name pada request body 
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    
    // Filtering jika client melampirkan properti readPage 
    // yang lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    
    // Sisi server
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading, 
        id, 
        finished, 
        insertedAt, 
        updatedAt,
    };

    // Memasukkan ke array books
    books.push(newBook);

    // Masukkan ke isSuccess
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    // Jika buku berhasil dimasukkan, maka server akan merespon berhasil
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // Respon jika server gagal memasukkan buku karena alasan umum (generic error)
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// Menampilkan seluruh buku yang disimpan
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    
    if (!name && !reading && !finished) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    
    // Jika ada query name
    if (name) {
        const filteredBooksName = books.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });
    
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    
    // Jika ada query reading
    if (reading) {
        const filteredBooksFinished = books.filter(
            (book) => Number(book.reading) === Number(reading),
        );
    
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    
    // Jika ada query finished
    const filteredBooksFinished = books.filter(
        (book) => Number(book.finished) === Number(finished),
    );
    
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooksFinished.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

// Fungsi untuk menampilkan detail data buku
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    // Filtering dan respon jika buku yang diminta ada di server 
    if (book) {
        const response = h.response({
            status: 'success',
            data: { 
                book,
            },
        });
        response.code(200);
        return response;
    }

    // Respon jika buku yang diminta tidak ada di server
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Fungsi untuk mengubah data buku
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // Filtering dan respon yang diberikan jika tidak melampirkan properti name
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Filtering dan respon yang diberikan jika readPage lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((note) => note.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };

        // Respon yang dikirim jika buku berhasil diperbarui
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    // Jika id yang diminta client tidak ditemukan server
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Fungsi untuk menghapus data buku
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((note) => note.id === bookId);

    // Filtering dan respon jika buku berhasil dihapus
    if (index !== -1) {
        books.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    // Bila id yang diminta tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Export
module.exports = { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
