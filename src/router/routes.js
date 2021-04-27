import CallBack from 'views/authentication/callback';
import SilentRenew from 'views/authentication/silent-renew';
import Signout from 'views/authentication/signout';
import Search from 'views/search';
import BookIndex from 'views/books/book-index';
import BookOverview from 'views/books/book-overview';
import BookReader from 'views/books/book-reader';
import AuthorOverview from 'views/authors/author-overview';
import AuthorIndex from 'views/authors/author-index';

export const routes = [
    {name: 'callback', path: '/callback', component: CallBack, meta: {unprotected: true}},
    {name: 'silent-renew', path: '/silent-renew', component: SilentRenew, meta: {unprotected: true}},
    {name: 'signout', path: '/signout', component: Signout, meta: {unprotected: true}},
    {name: 'search', path: '/search/q=:query?', component: Search},
    {name: 'books', path: '/', component: BookOverview},
    {name: 'book-index', path: '/books/:bookId', component: BookIndex},
    {name: 'read', path: '/books/:bookId/:chapterId', component: BookReader, meta: { scrollToTop: true, ignoreRouteUpdate: true }},
    {name: 'read-publication', path: '/books/:bookId/:year/:month/:chapterId?', component: BookReader, meta: { scrollToTop: true, ignoreRouteUpdate: true }},
    {name: 'authors', path: '/authors', component: AuthorOverview},
    {name: 'author-index', path: '/authors/:authorId', component: AuthorIndex},
    {name: 'Mandelblomsten', path: '/books/11', component: BookIndex, alias: ['/mandelblomsten', '/mb']},
    {name: 'SkjulteSkatter',  path: '/books/1',component: BookIndex, alias: ['/skjulteskatter', '/ss']},
];


