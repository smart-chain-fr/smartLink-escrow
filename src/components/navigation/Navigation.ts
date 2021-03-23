import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class'

const contract = namespace('contract')
const user = namespace('user')
@Component
export default class Navigation extends Vue {
    @Prop({default: true, type: Boolean}) drawer: boolean;
    public nbNew = this.$store.state.user.numberOfItems
    public navigation = [
        { title: 'Market place', icon: 'mdi-shopping', name:'marketplace'},
        { title: 'Offers', icon: 'mdi-chat', name:'offers' },
        { title: 'Track orders', icon: 'mdi-cube-send', name:'orders' },
        { title: 'Admin', icon: 'mdi-crown', name:'admin' },
        { title: 'Originate contract', icon: 'mdi-note-plus', name:'originate' }, 
      ]

}
