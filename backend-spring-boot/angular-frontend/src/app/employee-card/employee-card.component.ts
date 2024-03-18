import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee-list/employee.service';
import { Employee } from '../employee-list/employee.model';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.css']
})

export class EmployeeCardComponent {
  employee : Employee | undefined;
  tabs: Tab[] = [
    { key: 'General Information', title: 'General Information' },
    { key: 'Working Hours', title: 'Working Hours' },
    { key: 'Training', title: 'Training' },
    { key: 'Salary', title: 'Salary' },
    { key: 'Skills', title: 'Skills' },
    // Add more tabs as needed
  ];
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private employeeService : EmployeeService
  ){}

  goBack() {
    this.router.navigate(['/employees']); 
  }

  ngOnInit():void{
    console.log(this.employee?.personalInformation.birthday)
    this.route.params.subscribe((params) => {
      const employeeId = params["id"];
      this.employeeService.getEmployeeById(employeeId).subscribe((employee)=> {
        this.employee = employee
      })
    })
  }

}
interface Tab {
  key: string;
  title: string;
  // Add more properties as needed
}