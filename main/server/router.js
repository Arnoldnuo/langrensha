module.exports = function(router){
    router.route('/book')
        // PUT /main/book
        .put(router.action('book').put)
        // GET /main/book
        .get(router.action('book'));

    router.route('/book/:id')
        // GET /main/book/1
        .get(router.action('book').get)
        // DELETE /main/book/1
        .delete(router.action('book').delete);
};
