import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { EmployeeService } from '../employee-list/employee.service';
import { UpcomingBirthdaysDialogComponent } from './ birthday-dialog/birthday-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Employee } from '../employee-list/employee.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private dialogService: DialogService,
    private employeeService: EmployeeService
  ) {}

  departmentChart: any;
  positionChart: any;
  employees: Employee[] | [] = [];
  missingEmployees: Employee[] | [] = [];
  upcomingBirthdaysNumber: number | null = null;
  upcomingBirthdays: Employee[] = [];
  
  ngOnInit(): void {
    this.employeeService.getEmployees().then(
      (employees) => {
        this.employees = employees;
        this.missingEmployees = this.employees.filter((employee)=> employee.missing === true)
        this.initDepartmentChart();
        this.initPositionChart();
      },
      (error) => {
        console.error('Error fetching total employees:', error);
      }
    );
    this.fetchUpcomingBirthdays();
  }

  initDepartmentChart(): void {
    const chartDom = document.getElementById('department');
    this.departmentChart = echarts.init(chartDom);
    const option = this.getDepartmentChartOption();
    this.departmentChart.setOption(option);
  }

  initPositionChart(): void {
    const chartDom = document.getElementById('position');
    this.positionChart = echarts.init(chartDom);
    const option = this.getPositionChartOption();
    this.positionChart.setOption(option);
  }
  getDepartmentChartOption(): any {
    const departmentCounts: { [key: string]: number } = {};
    this.employees.forEach((employee) => {
      const department = employee.employmentDetails.department;
      if (department) {
        if (departmentCounts[department]) {
          departmentCounts[department]++;
        } else {
          departmentCounts[department] = 1;
        }
      }
    });

    const data = Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Employees by Department',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };
  }

  getPositionChartOption(): any {
    const positionCounts: { [key: string]: number } = {};
    this.employees.forEach((employee) => {
      const position = employee.employmentDetails.position;
      if (position) {
        if (positionCounts[position]) {
          positionCounts[position]++;
        } else {
          positionCounts[position] = 1;
        }
      }
    });

    const data = Object.entries(positionCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      color: [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff',
        '#ff9900',
        '#9900ff',
        '#cc00ff',
      ],
      series: [
        {
          name: 'Employee by Position',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          // adjust the start and end angle
          startAngle: 270,
          endAngle: 90,
          data: data,
        },
      ],
    };
  }

  openUpcomingBirthdaysDialog() {
    if (this.upcomingBirthdaysNumber && this.upcomingBirthdaysNumber > 0) {
      const ref = this.dialogService.open(UpcomingBirthdaysDialogComponent, {
        header: 'Upcoming Birthdays',
        data: {
          header: 'Upcoming Birthdays',
          employees: this.upcomingBirthdays,
        },
      });

      ref.onClose.subscribe(() => {});
    }
  }

  fetchUpcomingBirthdays() {
    this.employeeService.getUpcomingBirthdays().subscribe({
      next: (employees) => {
        this.upcomingBirthdays = employees;
        this.upcomingBirthdaysNumber = employees.length;
      },
      error: (error) => {
        console.error('Error fetching upcoming birthdays:', error);
      },
    });
  }
}
