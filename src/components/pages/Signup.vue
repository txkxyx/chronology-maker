<template>
    <q-layout>
        <q-page-container>
            <q-page>
                <div class="row justify-center">
                    <div class="col-md-auto">
                        <h3 class="text-center">ユーザー登録</h3>
                        <q-form @submit="signUp" class="q-gutter-md">
                            <span v-if="errorMessage !== ''">{{errorMessage}}</span>
                            <q-input class="q-mb-md" v-model="name" label="名前" type="text" />
                            <q-input class="q-mb-md" v-model="aka" label="ニックネーム" type="text" />
                            <q-input class="q-mb-md" v-model="email" label="メールアドレス" type="email" />
                            <q-input class="q-mb-md" v-model="password" label="パスワード" type="password" />
                            <q-input class="q-mb-md" v-model="career" label="キャリアスタート" type="month" />
                            <div class="text-center">
                                <q-btn absolute-center type="submit" color="primary" label="登録" />
                            </div>
                        </q-form>
                    </div>
                    
                </div>
            </q-page>
    </q-page-container>
    </q-layout>
</template>
<script>
import firebase from 'firebase'
import db from '../../firebase/firebaseInit'
import store from '../../store';

export default {
    name: "Signup",
    data(){
        return{
            name: '',
            aka: '',
            email: '',
            password: '',
            career: '',
            errorMessage: ''
        }
    },
    methods:{
        /**
         * ユーザー登録を行う
         */
        signUp(){
            // Email, Passwordでユーザー登録を行う
            firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(() => {
                // ストアの状態をログアウト状態にする
                store.dispatch('updateStatus', false)
                store.commit('setAuth', {})
                // ユーザーテーブルと年表テーブルを操作
                const usersRef = db.collection('users')
                const chronologyRef = db.collection('chronology')
                // ユーザーテーブルにIDを指定して登録
                firebase.auth().onAuthStateChanged((user) => {
                    if(user){
                        const uid = user.uid
                        usersRef.doc(uid).set({
                            name: this.name,
                            aka: this.aka,
                            startAt: new Date(this.career).getFullYear()
                        }).then(() => {
                            // キャリアを開始したイベントを初期値として登録する
                            let events = [
                                {
                                    date: new Date(this.career).getTime(),
                                    title: "キャリアスタート",
                                    event: "エンジニアとしてのキャリアをスタートさせる"
                                }
                            ]
                            let careers = [
                                {
                                    year: new Date(this.career).getFullYear(),
                                    events: events
                                },
                            ]
                            // 年表データを登録
                            chronologyRef.doc(uid).set({
                                title: this.aka + 'さんの年表',
                                careers: careers
                            }).then(() => {
                                // メインコンポーネントに遷移
                                this.$router.push({name: 'Main'})
                            }).catch((err) => {
                                this.errorMessage = err
                                console.log(err)
                            })
                        }).catch((err) => {
                            console.log(err)
                            this.errorMessage = err
                        })
                    }
                })
                
                console.log("what")
            }).catch((err) => {
                console.log(err)
                this.errorMessage = err
            })
        }
    }
}
</script>