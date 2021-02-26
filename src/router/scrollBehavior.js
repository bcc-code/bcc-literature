export default function scrollBehavior(to, from, savedPosition) {
    if (to.name === from.name && to.meta.ignoreRouteUpdate) {
        return;
    }
    if (to.meta.scrollToTop === true){
        return { x: 0, y: 0 };
    }
    if (savedPosition) {
        return savedPosition;
    }
    if (to.hash) {
        return { selector: to.hash };
    }
    return { x: 0, y: 0 };
}