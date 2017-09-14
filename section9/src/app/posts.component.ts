import { OnInit } from '@angular/core';

import { Component } from '@angular/core';

import { PostService } from './services/post.service';

import { AppError } from './common/app-error';
import { NotFoundError } from './common/not-found-error';
import { BadInput } from './common/bad-input';

@Component({
    selector: 'posts-component',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit { 
    posts: any[];

    constructor(private service: PostService) { }

    ngOnInit() {
        this.service.getAll()
                    .subscribe(posts => this.posts = posts);
    }

    createPost(input: HTMLInputElement) {
        let post = { title: input.value };
        input.value='';
        this.service.create(input)
                    .subscribe(
                       post => {
                          post['id'] = post.id;
                          this.posts.splice(0, 0, post);
                       }, 
                       (error: Response) => {
                          if(error instanceof BadInput) {
                          //  this.form.setErrors(error.originalError);
                          }
                          else throw error;   
                    });
    }

    updatePost(post) {
        this.service.update(post)
                    .subscribe(post => console.log(post));
    }

    deletePost(post) {
        this.service.delete(345)
                 .subscribe(
                   () => {
                       let index = this.posts.indexOf(post);
                       this.posts.splice(index, 1);
                    }, 
                    (error: AppError) => {
                       if(error instanceof NotFoundError)
                          alert('This post has already been deleted.');
                       else throw error;
                 });
    }
}