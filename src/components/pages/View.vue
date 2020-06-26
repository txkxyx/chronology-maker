<template>
    <div class="q-px-lg q-pb-md">
        <q-timeline layout="loose" color="secondary">
        <q-timeline-entry heading>
            <strong>{{ chronology.title }}</strong>
        </q-timeline-entry>
        <div v-for="(career, c_index) in chronology.careers" :key="c_index">
            <li v-for="(event, e_index) in career.events" :key="e_index" class="q-timeline__entry q-timeline__entry--icon" :class="e_index % 2 === 0 ? 'q-timeline__entry--right' : 'q-timeline__entry--left'">
                <div class="q-timeline__subtitle">
                    <span style="font-size: 1.5em;">{{getDate(Number(event.date), 'YYYY-MM-DD')}}</span>
                </div>
                <div class="q-timeline__dot" :class="'text-' + getColor(c_index, e_index)">
                    <i aria-hidden="true" role="presentation" class="row items-center justify-center material-icons q-icon notranslate">arrow_drop_up</i>
                </div>
                <div class="q-timeline__content">
                    <h6 class="q-timeline__title"><strong>{{event.title}}</strong></h6>
                    <div class="row" :class="e_index % 2 === 0 ? 'justify-start' : 'justify-end'">
                        <div class="col-9" v-html="getEvent(event.event)">
                        </div>
                    </div>
                </div>
            </li>
            <q-timeline-entry class="q-mb-md" tag="h4" heading><strong>{{career.year}}</strong></q-timeline-entry>
        </div>
        </q-timeline>
    </div>
</template>
<script>
import moment from "moment";
import marked from "marked"
import hljs from "highlight.js"
import db from "../../firebase/firebaseInit"
import { colorPalet } from "../../common/colorPalet"

export default {
    name: "View",
    data(){
    return{
        chronology: null
        }
    },
    methods:{
        getChronology(){
            const uid = this.$route.params.id
            db.collection("chronology").doc(uid).get().then((doc) => {
                if(doc.data()){
                this.chronology = doc.data()
                }
            })
        },
        setupHightjs(){
            marked.setOption({
                langPrefix: '',
                highlight: function(code, lang){
                    return hljs.highlightAuto(code, [lang]).value
                }
            })
        }
    },
    created(){
        this.getChronology()
        this.setupHightjs()
    },
    computed:{
        getDate: function(){
            return function(date, format){
                return moment(date).format(format);
            }
        },
        getAuth(){
            return this.$store.getters.auth
        },
        getEvent(){
            return function(event){
                return marked(event)
            }
        },
        getColor(){
            return function(c_index, e_index){
                return colorPalet[c_index % 10][e_index % 10]
            }
        }
    }
}
</script>
<style src='highlight.js/styles/github-gist.css'></style>