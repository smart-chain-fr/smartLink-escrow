import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Navigation extends Vue {
    @Prop({default: true, type: Boolean}) drawer: boolean;

    public navigation = [
        { title: 'Market place', icon: 'mdi-shopping', href:'/market-place'},
        { title: 'Offers', icon: 'mdi-chat', href:'/offers' },
        { title: 'Track orders', icon: 'mdi-cube-send', href:'orders' },
        { title: 'Admin', icon: 'mdi-crown', href:'/admin' },
        { title: 'Originate contract', icon: 'mdi-note-plus', href:'/' },
      ]

}
