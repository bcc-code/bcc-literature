export default {
    methods: {
        highlightedName(name){
            return (this.searchQuery && this.searchQuery.trim()) ? name.replace(new RegExp(`(${this.searchQuery})`, "gi"), "<span>\$1</span>") : name;  
        },
        isSearchResult(name){
            return this.searchQuery == '' || this.highlightedName(name) != name;
        }
    },

}