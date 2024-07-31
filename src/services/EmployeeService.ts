import { Employees } from "@prisma/client";
import prisma from "../database/prisma";

type EmployeeUpdateInput = Partial<
  Omit<Employees, "id" | "created" | "updated">
>;
class EmployeeService {
  async getByIdInfo(id: number) {
    const user = await prisma.employeesInfo.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        password:true,
        email: true,
        role: {
          select: {
            roleId: true,
            role: true,
            employee: true,
            employeeId: true
          }
        }
      },
    });

    return user;
  }

  async createInfo(
    roles: string[],
    name: string,
    password: string,
    passwordConfirmation: string,
    department: string,
    company: string,
    unit: string,
    networkUser: string,
    networkPassword: string,
    email: string,
    emailPassword: string,
    discordEmail: string,
    discordPassword: string,
    notebookBrand: string,
    notebookName: string,
    notebookProperty: string,
    coolerProperty: string,
    officeVersion: string,
    windowsVersion: string,
    employeeId: number
  ) {
    if (password !== passwordConfirmation) {
      throw new Error("Senhas não conferem!");
    }

    const userAlreadyExists = await prisma.employeesInfo.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const user = await prisma.employeesInfo.create({
      data: {
        name,
        role: {
          create: roles.map(role => ({
            role: {
              connectOrCreate: {
                where: { name: role },
                create: { name: role }
              }
            }
          }))
        },
        password,
        department,
        company,
        unit,
        networkUser,
        networkPassword,
        email,
        emailPassword,
        discordEmail,
        discordPassword,
        notebookBrand,
        notebookName,
        notebookProperty,
        coolerProperty,
        officeVersion,
        windowsVersion,
        employeeId,
      },
      
    });

    return user;
  }

  async deleteInfo(id: number) {
    const user = await prisma.employeesInfo.delete({
      where: { id },
    });

    return user;
  }

  async updateInfo(id: number, updateData: EmployeeUpdateInput, roles: { role: { name: string } }[]) { 

    const user = await prisma.employeesInfo.update({
      where: {
        id: id,
      },
      data: {
        ...updateData,
        role: roles.length > 0
        ? {
            deleteMany: {}, 
            create: roles.map(roleObj => ({
              role: {
                connectOrCreate: {
                  where: { name: roleObj.role.name },
                  create: { name: roleObj.role.name }
                }
              }
            }))
          }
        : undefined, 
    },
    });

    return user;
  }

  async getAllInfo(
    roles?: string,
    name?: string,
    department?: string,
    company?: string,
    unit?: string
  ) {
    const employees = await prisma.employeesInfo.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name ? name : "",
            },
          },
          department ? { department } : {},
          company ? { company } : {},
          unit ? { unit } : {},
        ],
      },
      select: {
        id: true,
        name: true,
        password:true,
        department: true,
        company: true,
        unit: true,
        networkUser: true,
        networkPassword: true,
        email: true,
        emailPassword: true,
        discordEmail: true,
        discordPassword: true,
        notebookBrand: true,
        notebookName: true,
        notebookProperty: true,
        coolerProperty: true,
        officeVersion: true,
        windowsVersion: true,
        employeeId: true,
        role: {
          select: {
            roleId: true,
            role: true,
            employee: true,
            employeeId: true
          }
        }
      },
      orderBy: {
        name: "asc",
      },
    });

    return employees;
  }
  async getById(id: number) {
    const user = await prisma.employees.findUnique({
      where: { id },
    });

    return user;
  }

  async create(
    name: string,
    birthday: string,
    cpf: string,
    ctps: string,
    serie: string,
    office: string,
    cbo: number,
    education: string,
    maritalStatus: string,
    nationality: string,
    pis: string,
    rg: string,
    cep: string,
    road: string,
    number: number,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    level: string,
    department: string,
    company: string,
    costCenter: string,
    dateAdmission: string,
    dateResignation: string,
    initialWage: string,
    currentWage: string
  ) {

    const userAlreadyExists = await prisma.employees.findUnique({
      where: { cpf },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!");
    }

    const user = await prisma.employees.create({
      data: {
        name,
        birthday,
        cpf,
        ctps,
        serie,
        office,
        cbo,
        education,
        maritalStatus,
        nationality,
        pis,
        rg,
        cep,
        road,
        number,
        complement,
        neighborhood,
        city,
        state,
        level,
        department,
        company,
        costCenter,
        dateAdmission,
        dateResignation,
        initialWage,
        currentWage
      },
    });

    return user;
  }

  async delete(id: number) {
    const user = await prisma.employees.delete({
      where: { id },
    });

    return user;
  }

  async update(id: number, updateData: EmployeeUpdateInput) {
    const user = await prisma.employees.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }

  async getAll(
    name?: string,
    office?: string,
  ) {
    
    const employees = await prisma.employees.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name ? name : "",
            },
          },
          office ? { office } : {},
        ],
      },
      orderBy: {
        name: "asc",
      },
    });

    return employees;
  }
}

export default new EmployeeService();
