<template>
    <q-layout>
        <q-page-container>
            <q-page>
                <div class="row justify-center">
                    <div class="col-md-auto">
                        <h3 class="text-center">ログイン</h3>
                        <q-form @submit="signIn" class="q-gutter-md">
                            <q-input class="q-mb-md" v-model="email" label="メールアドレス" type="email" />
                            <q-input class="q-mb-md" v-model="password" label="パスワード" type="password" />
                            <div class="text-center">
                                <q-btn fixed-center type="submit" color="primary" label="ログイン" />
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
import store from '../../store';

export default {
    data(){
        return{
            email: '',
            password: '',
            errorMessage: ''
        }
    },
    methods:{
        /**
         * ログインを行う
         */
        signIn(){
            // Email, Passwordでログインを行う
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
                // ストアの情報をログアウト状態にする
                store.dispatch('updateStatus', false)
                store.commit('setAuth', {})
                // エラーメッセージを初期化
                this.errorMessage = ''
                // メインコンポーネントに遷移する
                this.$router.push({name: 'Main'})
            }).catch((err) => {
                console.log(err)
                this.errorMessage = err.message
            })
        }
    }
}
</script>