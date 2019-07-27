import { Injectable } from '@angular/core';
import { IProfileModel } from './interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor() { }

  getProfiles() {
    let profiles = JSON.parse(localStorage.getItem('optools-profiles'));
    
    if(profiles) {
      profiles.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);

      return profiles;
    }
    
    return [];
  }

  updateProfiles(profiles: IProfileModel[]) {
    localStorage.setItem('optools-profiles', JSON.stringify(profiles));
  }

}
