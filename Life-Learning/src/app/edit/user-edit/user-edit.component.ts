import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { AlertasService } from 'src/app/service/alertas.service';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  user: User = new User()
  idUser: number
  confirmarSenha: string
  tipoUsuario: string

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertas: AlertasService
  ) { }

  ngOnInit() {
    window.scroll(0,0)

    if(environment.token == ""){
      this.router.navigate(['/logar'])
    }

    this.idUser = this.route.snapshot.params['id']
    this.findByIdUser(this.idUser)
  }

  confirmSenha(event: any){
    this.confirmarSenha = event.target.value
  }

  tipoUser(event: any){
    this.tipoUsuario = event.target.value
  }

  atualizar(){
      this.user.tipo = this.tipoUsuario

      if(this.user.senha != this.confirmarSenha){
        this.alertas.showAlertDanger('As senhas não conferem!')
      }else {

        if(this.user.foto == null) {
          this.user.foto = 'https://cdn.iconscout.com/icon/free/png-256/account-avatar-profile-human-man-user-30448.png'
          console.log(this.user.foto)
        }
        this.authService.cadastrar(this.user).subscribe((resp:User) => {
          this.user = resp
          this.router.navigate(['/inicio'])
          alert('Usuário atualizado com sucesso, faça o login novamente!')
          environment.token = ''
          environment.nome = ''
          environment.id = 0
          environment.foto = ''

          this.router.navigate(['/logar'])

          console.log(this.user.foto)
        })
      }

  }

  findByIdUser(id: number){
    this.authService.getByIdUser(id).subscribe((resp: User) =>{
      this.user = resp
    })
  }

}
