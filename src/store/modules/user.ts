import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
@Module({ namespaced: true })
class User extends VuexModule {
  public removed: Array<String>  = []
  public viewed: Array<String> = []
  public numberOfItems: number = 0;

  @Mutation
  public setNumberOfItems(number: number): void {
    this.numberOfItems = number;
  }

  @Mutation
  public setRemoved(item: string): void {
    this.removed.push(item)
    if (!this.viewed.includes(item)) 
    {
      this.viewed.push(item)
      this.numberOfItems = this.numberOfItems - 1
    }
  }

  @Mutation
  public setViewed(item: string): void {
    this.viewed.push(item)
    this.numberOfItems = this.numberOfItems - 1
  }

  @Mutation
  public resetRemoved(): void {
    this.removed = [];
  }

  @Mutation
  public resetViewed(): void {
    this.viewed = []
  }

  @Action({ rawError: true })
  public updateNumberOfItems(number: number): void {
    this.context.commit('setNumberOfItems', number)
  }

  @Action({ rawError: true })
  public updateRemoved(item: string): void {
    this.context.commit('setRemoved', item)
  }

  @Action({ rawError: true })
  public updateViewed(item: string): void {
    this.context.commit('setViewed', item)
  }

  @Action({ rawError: true })
  public updateResetRemoved(): void {
    this.context.commit('resetRemoved')
  }

  @Action({ rawError: true })
  public updateResetViewed(): void {
    this.context.commit('resetViewed')
  }


}
export default User