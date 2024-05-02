import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container, Pagination} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  data: {
    users: TUserItem[]
    totalPagesCount: number
  }
}

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const page = ctx.query.page || 1
    const res = await fetch(`http://localhost:3000/users?page=${page}&itemCount=20`, {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, data: {users: [], totalPagesCount: 0}}}
    }
    return {
      props: {statusCode: 200, data: await res.json() }
    }
  } catch (e) {
    return {props: {statusCode: 500, data: {users: [], totalPagesCount: 0}}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>

export default function Home({statusCode, data}: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }
  const router = useRouter();
  const [page, setPage] = useState<number>(1);

  const handlePagination = (page: number) => {
    if(page < 1 || page > data.totalPagesCount) return;
    const path = router.pathname
    const query = router.query
    query.page = page.toString()
    setPage(page)
    router.push({
      pathname: path,
      query: query,
    }) 
  }
  
  const showedItems = () => {
    const displayedPagesCount = 9;
    const paginationItems: any[] = [];
    const startNum = Math.max(1, Math.round(page - displayedPagesCount / 2));
    const finalNum = Math.min(data.totalPagesCount, startNum + displayedPagesCount);
    for (let i = startNum; i <= finalNum; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePagination(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return paginationItems;
  }
  
  useEffect(() => {
    const path = router.pathname
    const query = router.query
    query.page = page.toString()
    router.push({
      pathname: path,
      query: query,
    }) 
  }, [])

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              data.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First
              key="first"
              onClick={() => handlePagination(1)}
            />
            <Pagination.Prev
              key="prev"
              onClick={() => handlePagination(page - 1)}
            />
            {showedItems()}
            <Pagination.Next
              key="next"
              onClick={() => handlePagination(page + 1)}
            />
            <Pagination.Last
              key="last"
              onClick={() => handlePagination(data.totalPagesCount)}
            />
          </Pagination>

        </Container>
      </main>
    </>
  );
}
