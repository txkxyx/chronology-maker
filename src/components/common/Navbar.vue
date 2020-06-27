<template>
    <q-toolbar class="bg-dark text-white shadow-2 ">
        <q-btn to="/" flat label="年表メーカー" />
        <q-space />
        <span v-if="isLogin">
            <q-btn-dropdown stretch flat label="Menu">
                <q-list>
                    <q-item>
                        <q-btn :to="'/' + getAuth.id + '/view'" stretch flat :label="getAuth.name + 'さんの年表'" icon="assignment_ind"/>
                    </q-item>
                    <q-item>
                        <q-btn :to="'/' + getAuth.id + '/edit'" stretch flat label="年表を編集" icon="history_edu"/>
                    </q-item>
                    <q-item>
                        <q-btn :to="'/auth/edit/' + getAuth.id" stretch flat label="ユーザーを編集" icon="account_circle"/>
                    </q-item>
                    <q-item>
                        <q-btn :to="'/auth/password/edit/' + getAuth.id" stretch flat label="パスワード変更" icon="lock"/>
                    </q-item>
                    <q-item>
                        <q-btn @click="signOut" stretch flat label="ログアウト" icon="exit_to_app"/>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            
        </span>
        <span v-else>
            <q-btn to="/auth/signin" stretch flat label="ログイン" icon="login"/>
        </span>
        <span>
            <q-btn to="/auth/signup" stretch flat label="ユーザー登録" icon="perm_identity"/>
        </span>
    </q-toolbar>
</template>
<script>
import firebase from 'firebase';
import db from '../../firebase/firebaseInit';
import store from '../../store';

export default {
    methods: {
        /**
         * ログイン状態かを判定する
         */
        isAuth(){
            firebase.auth().onAuthStateChanged((user) => {
                // ユーザー情報をストアに保存する
                if(user){
                    store.dispatch('updateStatus', true)
                    this.getUser(user.uid)
                }
            })
        },
        /**
         * ログアウトを行う
         */
        signOut(){
            firebase.auth().signOut().then(() => {
                // ストアの情報をログアウト状態にする
                store.dispatch('updateStatus', false)
                store.commit('setAuth', {})
                // ログイン画面に遷移
                this.$router.push('/auth/signin')
            })
        },
        /**
         * ユーザーIDを基に、USERSテーブルからユーザー情報を取得する
         * @uid ユーザーID
         */
        getUser(uid){
            if(uid){
                // USERSテーブルからユーザー情報を取得する
                const usersRef = db.collection('users')
                usersRef.doc(uid).get().then((doc) => {
                    let user = doc.data()
                    user.id = doc.id
                    // ストアの更新
                    store.commit('setAuth', user)
                })
            }
        }
    },
    mounted(){
        /**
         * マウント時にログイン状態を確認
         */ 
        this.isAuth()
    },
    computed: {
        /**
         * ストアからログイン状態を取得
         */
        isLogin(){
            return this.$store.getters.status
        },
        /**
         * ストアからログインユーザー情報を取得
         */
        getAuth(){
            return this.$store.getters.auth
        }
    }
}
</script>