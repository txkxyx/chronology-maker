<template>
    <div class="q-px-lg q-pb-md">
        <q-btn rounded class="fixed-bottom-right q-mb-xl q-mr-xl z-top" style="font-size: 1.2rem;" @click.prevent="editChrology" label="変更を適用する" color="primary" icon="send"/>
        <div class="row justify-center">
            <div class="col-6 text-center" >
                <p class="text-negative" v-if="errorMessage != ''">{{errorMessage}}</p>
                <q-input class="q-mb-md" v-model="title" label="年表タイトル" type="text"/>
                <q-btn rounded color="secondary" icon="add_circle_outline" label="新しいイベントを追加する" @click="showDialog=true"/>
                <q-dialog v-model="showDialog" persistent>
                    <q-card style="width: 700px; max-width: 80vw;">
                        <q-card-section>
                            <div class="text-h6">新しいイベントを追加する</div>
                            <p class="text-negative" v-if="dialogErrorMessage != ''">{{dialogErrorMessage}}</p>
                        </q-card-section>
                        <q-card-section class="a-pt-none">
                            <q-input class="q-mb-md" v-model="newDate" label="日付" type="date" filled/>
                            <q-input class="q-mb-md" v-model="newTitle" label="タイトル" type="text" filled/>
                            <q-input class="q-mb-md" v-model="newEvent" label="イベント" type="textarea" filled/>
                        </q-card-section>
                        <q-card-actions>
                            <q-btn flat @click.prevent="addEvent" label="追加する" color="primary"/>
                            <q-btn flat @click.prevent="clickCancel" label="キャンセル" color="primary"/>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                
            </div>
        </div>
        <q-timeline layout="loose" color="secondary">
            <div v-for="(career, c_index) in careers" :key="c_index">
                <q-separator inset="item" />
                <q-timeline-entry class="q-mt-md" tag="h4" heading>{{career.year}}</q-timeline-entry>
                <div class="text-center q-mb-md">
                    <q-btn class="q-mr-md" rounded color="secondary" icon="add_circle_outline" :label="career.year + '年にイベントを追加'" @click="clickAddYear(career.year)"/>
                    <q-btn class="q-ml-md" rounded @click.prevent="deleteYear(career.year)" :label="career.year + '年を削除'" color="red" icon="highlight_off"/>
                </div>
                <li v-for="(event, e_index) in career.events" :key="e_index" class="q-timeline__entry q-timeline__entry--icon q-timeline__entry--right">
                    <div class="q-timeline__subtitle">
                        <q-input class="q-mb-md" @input="editEventDate(new Date($event).getTime(),career.year,Number(event.date))" :value="getDate(Number(event.date), 'YYYY-MM-DD')" label="日付" type="date" filled/>
                    </div>
                    <div class="q-timeline__dot" :class="'text-' + getColor(c_index, e_index)">
                        <i aria-hidden="true" role="presentation" class="row items-center justify-center material-icons q-icon notranslate">arrow_drop_up</i>
                    </div>
                    <div class="q-timeline__content">
                        <q-input class="q-mb-md" v-model="event.title" label="タイトル" type="text" filled/>
                        <q-input class="q-mb-md" v-model="event.event" label="イベント" type="textarea" filled/>
                        <q-btn rounded class="q-mb-md" @click.prevent="deleteEvent(career.year,Number(event.date))" label="削除" color="red" icon="highlight_off"/>
                    </div>
                </li>
            </div>
        </q-timeline>
    </div>
</template>
<script>
import firebase from "firebase"
import db from "../../firebase/firebaseInit"
import moment from "moment"
import { sortCareers } from "../../common/chronologyFunctions"
import { colorPalet } from "../../common/colorPalet"

const chronologyRef = db.collection("chronology")

export default {
    name: "Edit",
    data(){
        return{
            id: "",
            title: "",
            showDialog: false,
            newDate: "",
            newTitle: "",
            newEvent: "",
            careers: [],
            errorMessage: "",
            dialogErrorMessage: ""
        }
    },
    methods:{
        /**
         * 年表情報をfirestoreの状態に更新する
         */
        setupChronology(){
            // URLパラメータから年表IDを取得する
            const id = this.$route.params.id
            firebase.auth().onAuthStateChanged(user => {
                if(user && user.uid === id){
                    // 年表テーブルから年表データを取得する
                    chronologyRef.doc(id).get().then((doc) => {
                        this.id = doc.id
                        this.title = doc.data().title
                        this.careers = doc.data().careers
                    })
                }else{
                    this.$router.push("/")
                }
            })
        },
        /**
         * 年表の編集をfirestoreに適用する
         */
        editChrology(){
            // 年表情報を並び替える
            sortCareers(this.careers)
            // 年表テーブルを更新する
            chronologyRef.doc(this.id).update({
                title: this.title,
                careers: this.careers
            }).then(() => {
                this.$router.push("/" + this.id + "/view")
            }).catch((err) => {
                console.log(err)
            })
        },
        /**
         * イベントの日時を更新する
         * @newDate 新しい日付
         * @year 対象のイベントの年
         * @prevDate 元の日付
         */
        editEventDate(newDate, year, prevDate){
            // エラーメッセージを初期化
            this.errorMessage = ""
            // キャリア情報をループ
            this.careers.forEach(career => {
                // 年が一致した場合
                if(career.year === year){
                    // その年のイベントの日付一覧をSetに格納
                    let dateSet = new Set()
                    career.events.forEach(event => dateSet.add(event.date))
                    if(dateSet.has(newDate)){
                        // 新しい日付がすでに登録されている場合
                        this.errorMessage = "すでに日付が存在します"
                    }else{
                        // 新しい日付が登録されていない場合、イベントの日付を新しい日付に変更する
                        career.events.some(event => {
                            if(event.date === prevDate){
                                event.date = newDate
                                return true
                            }
                        })
                    }
                }
            })
        },
        /**
         * 「xx年にイベントを追加する」ボタンを押下した際
         */
        clickAddYear(year){
            this.newDate = year + "-04-01"
            this.showDialog=true
        },
        /**
         * イベントを追加する
         */
        addEvent(){
            // 日付から年を取得する
            const year = Number(this.newDate.split("-")[0])
            // 日付からTimestampを取得する
            const newDate = new Date(this.newDate).getTime()
            // 登録するイベントオブジェクトを作成
            let newEvent = {
                date: newDate,
                title: this.newTitle,
                event: this.newEvent
            }
            // 選択した日付が、キャリア内で新しい年かを判定する
            let newYearFlg = true
            // キャリアをループ
            this.careers.some(career => {
                // 選択した日付の年が、すでにキャリアに存在する場合
                if(career.year === year){
                    // 新しい年を追加しない
                    newYearFlg = false
                    // イベント内をループ
                    career.events.some(event => {
                        if(event.date === newDate){
                            // 選択した日付がすでに存在する場合、イベントを追加しない
                            this.dialogErrorMessage = "すでに日付が存在します"
                        }else{
                            // イベントを追加
                            career.events.push(newEvent)
                            // ダイアログを非表示、エラーメッセージを初期化
                            this.showDialog = false
                            this.dialogErrorMessage = ""
                            // 入力フォームを初期化
                            this.newYear = ""
                            this.newTitle = ""
                            this.newEvent = ""
                        }
                        return true
                    })
                    return true
                }
            })
            // キャリア内で新しいイベントであった場合
            if(newYearFlg){
                // キャリアとイベントを追加する
                this.careers.unshift({
                    year: year,
                    events:[newEvent]
                })
                // ダイアログを非表示、エラーメッセージを初期化
                this.showDialog = false
                this.dialogErrorMessage = ""
                // 入力フォームを初期化
                this.newYear = ""
                this.newTitle = ""
                this.newEvent = ""
            }
            // キャリアをソート
            sortCareers(this.careers)
        },
        /**
         * キャンセルボタンを押下したとき、ダイアログのメッセージを空にしダイアログを閉じる
         */
        clickCancel(){
            this.dialogErrorMessage = ""
            this.showDialog = false
        },
        /**
         * 選択した年のイベントを全て削除する
         * @year 年
         */
        deleteYear(year){
            // 確認する
            const result = window.confirm(year + "年を削除してもよろしいですか")
            // 対象の年がキャリア内で何番目のインデックスかを検索し、キャリアを削除する
            let index = 0
            if(result){
                this.careers.forEach((career, i) => {
                    if(career.year === year) index = i
                })
                this.careers.splice(index,1)
            }
        },
        /**
         * 選択したイベント単体を削除する
         * @year 年
         * @date 日付
         */
        deleteEvent(year, date){
            // 確認
            const result = window.confirm(moment(new Date(date)).format("YYYY年MM月DD日のイベントを削除してもよろしいですか？"))
            if(result){
                // キャリア内をループ
                this.careers.some((career) => {
                    // インデックスを指定
                    let index = -1
                    // キャリアのイベント内をループし、対象の日付が存在する場合はそのインデックスを取得する
                    career.events.forEach((event, i) => {
                        if(event.date === date) index = i
                    })
                    // インデックスが初期値以外の場合は対象のイベントを削除
                    if(index !== -1){
                        career.events.splice(index, 1)
                        return true
                    }
                })
            }
        }
    },
    created(){
        // コンポーネント作成時に年表データを初期化する
        this.setupChronology()
    },
    computed:{
        /**
         * 日付をフォーマットして表示
         * @date 日付
         * @format フォーマット
         */
        getDate: function(){
            return function(date, format){
                return moment(date).format(format);
            }
        },
        /**
         * 指定された色のクラス名を取得する
         * @c_index 一次元のインデックス
         * @e_index 二次元のインデックス
         */
        getColor(){
            return function(c_index, e_index){
                return colorPalet[c_index % 10][e_index % 10]
            }
        }
    }
}
</script>