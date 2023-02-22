<template>
	<header :style="[ isStandalone ? { 'top' : '0 !important' } : '']">
        <a href="#" alt="Back Button" v-if="showBackButton" v-bind:class="'header__back-button'" @click.prevent="goBack"></a>
        <la-dropdown
            @click="setLanguage"
            :options="dropdownOptions"
            :button-text="currentLanguage"
            :inner-text="$t('app.select-language')" />
        <a href="#" alt="Night mode" class="header__night-mode" :class="{ 'dark': nightMode }" @click.prevent="toggleNightMode"></a>
        <h4 v-if="showBackButton">{{pageName}}</h4>
        <nav v-else>
            <router-link v-for="menu in ['books', 'authors']" :key="menu" :to="{ name: menu }" :class="{ 'current' : $t(`${menu}.${menu}`) == pageName }">
                {{$t(`${menu}.${menu}`)}}
            </router-link>
        </nav>
	</header>
</template>

<script>
import { EventBus, Events } from '@/utils/eventBus.js';
import LaDropdown from '@/components/la-dropdown';
import loadjs from "loadjs";
import { mapState } from 'vuex';
import { logCustomEvent } from '@/utils/appInsights';

export default {
    props: {
        backButtonRoute: {
            default: null,
            required: false,
        },
        pageName: {
            default: "",
            required: false
        },
        showLanguagePicker: {
            default: true,
            required: false
        },
        showBackButton: {
            default: true,
            required: false
        }
    },
    data() {
        return {
            showLanguageSelection: false,
            availableLanguages: [
                { code: 'af', name: 'Afrikaans' },
                { code: 'bg', name: 'Bulgarian' },
                { code: 'de', name: 'Deutsch' },
                { code: 'dk', name: 'Dansk' },
                { code: 'es', name: 'Español' },
                { code: 'en', name: 'English' },
                { code: 'fr', name: 'Français' },
		{ code: 'hr', name: 'Hvratski' },
                { code: 'it', name: 'Italiano' },
                { code: 'hu', name: 'Magyar' },
                { code: 'nl', name: 'Nederlands' },
                { code: 'no', name: 'Norsk'  },
                { code: 'pl', name: 'Polski' },
                { code: 'pt', name: 'Português' },
                { code: 'ro', name: 'Română' },
                { code: 'ru', name: 'Russian' },
		{ code: 'sr', name: 'Srbsko' },
		{ code: 'sl', name: 'Slovenski' },
                { code: 'fi', name: 'Suomi' },
                { code: 'tr', name: 'Türkçe' },
		
            ],
            appLanguages: ['no', 'en', 'de', 'fr', 'nl', 'fi']
        }
    },
    methods: {
        setLanguage(lang) {
            this.showLanguageSelection = false;
            this.$store.commit('session/setAppLanguage', lang);
            this.$i18n.locale = lang;
            EventBus.$emit(Events.CONTENT_LANGUAGE_CHANGED);
        },
        goBack() {
            if(!this.backButtonRoute) {
                window.history.back();
                return; 
            }
            this.$router.push(this.backButtonRoute)  
        },
        toggleNightMode() {
            this.$store.commit('session/toggleNightMode');
            this.setBrowserBarColor();

            logCustomEvent("ToggleNightMode", {
                NightMode: this.nightMode
            });
        },
        setBrowserBarColor() {
            document.querySelector('meta[name="theme-color"]')
                .setAttribute('content', this.nightMode ? "#1d1e22" : "#6291eb");
        },
        initTopbar() {
            var scriptId = "script-bcc-topbar";
            var self = this;
            if (document.getElementById(scriptId) == null) {
                var scriptPath = "https://widgets.bcc.no/widgets/TopbarJs";
                loadjs([scriptPath,"https://widgets.bcc.no/styles/widgets.css"], {
                    async: true,
                    success: function () {
                        self.$store.commit('session/setTopbarInitialized', true);
                    },
                    error: function (path) {
                        console.error('could not load resource: ' + path)
                    },
                    before: function (path, element) {
                        if(path === scriptPath ){
                            element.id = scriptId;
                            element.setAttribute("data-authentication-type", "SPA");
                            element.setAttribute(
                                "data-authentication-location",
                                "oidc.user:https://login.bcc.no:X0ac7C8sROIhEzRGLJPFpLCZAlKGK4KV.access_token"
                            );
                            // element.setAttribute("data-app-title", "BCC Literature");
                            // element.setAttribute("data-app-url", "https://literature.bcc.no");
                        }
                    }
                });
            }
        },
        hideHeaderOnScroll() {
            const header = document.querySelector("header");
            let lastScrollY = window.scrollY;
            let changedOn = window.scrollY;

            window.addEventListener("scroll", () => {
                if (window.scrollY >= 0) {
                    if (lastScrollY < window.scrollY) {
                        // Hide header only after scrolled down a bit
                        if (Math.abs(changedOn - window.scrollY) >= 48) {
                            header.classList.add("header--hidden");
                            changedOn = window.scrollY;
                        }
                    } else {
                        header.classList.remove("header--hidden");
                        changedOn = window.scrollY;
                    }

                    lastScrollY = window.scrollY;
                }
            });
        }
    },
    mounted: function() {
        if (!this.isStandalone)
            this.initTopbar()
        else
            this.$store.commit('session/setTopbarInitialized', true);

        this.setBrowserBarColor();
        this.hideHeaderOnScroll();
    },
    computed: {
        ...mapState('session', ['nightMode']),
        isStandalone() {
            return window.matchMedia('(display-mode: standalone)').matches
        },
        currentLanguage() {
            const code = this.$store.state.session.appLanguage;
            const lang = this.availableLanguages.find((l) => l.code === code);
            return lang ? lang.name : 'Not set';
        },
        dropdownOptions() {
            return this.availableLanguages.map((l) => {
                return { value: l.code, title: l.name }
            });
        }
    },
    components: {
        LaDropdown
    }
}
</script>
