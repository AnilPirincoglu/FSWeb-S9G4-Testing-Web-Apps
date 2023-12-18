import React from 'react';
import { getByTestId, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import { type } from '@testing-library/user-event/dist/type';

beforeEach(() => {
    render(<IletisimFormu />);
})

test('hata olmadan render ediliyor', () => {

});

test('iletişim formu headerı render ediliyor', () => {
    screen.getByText("İletişim Formu");
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    const name = screen.getByTestId("name");
    userEvent.type(name, "123");
    const error = await screen.findAllByTestId("error");
    expect(error).toHaveLength(1);
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    const button = screen.getByRole("button");
    userEvent.click(button);
    const error = await screen.findAllByTestId("error");
    expect(error).toHaveLength(3);

});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    const name = screen.getByTestId("name");
    const surname = screen.getByTestId("surname");
    userEvent.type(name, "Geçerli isim");
    userEvent.type(surname, "Geçerli soyisim");
    const button = screen.getByRole("button");
    userEvent.click(button);
    const error = await screen.findAllByTestId("error");
    expect(error).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    const name = screen.getByTestId("name");
    const surname = screen.getByTestId("surname");
    const email = screen.getByTestId("email");
    userEvent.type(name, "Geçerli isim");
    userEvent.type(surname, "Geçerli soyisim");
    userEvent.type(email, "Geçersiz email");
    const button = screen.getByRole("button");
    userEvent.click(button);
    const error = await screen.findByTestId("error");
    expect(error.textContent).toEqual("Hata: email geçerli bir email adresi olmalıdır.");
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const name = screen.getByTestId("name");
    const surname = screen.getByTestId("surname");
    const email = screen.getByTestId("email");
    userEvent.type(name, "Geçerli isim");
    userEvent.type(email, "gecerlimail@gecerli.com");
    const button = screen.getByRole("button");
    userEvent.click(button);
    const error = await screen.findByTestId("error");
    expect(error.textContent).toEqual("Hata: soyad gereklidir.");
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const name = screen.getByTestId("name");
    const surname = screen.getByTestId("surname");
    const email = screen.getByTestId("email");
    userEvent.type(name, "Geçerli isim");
    userEvent.type(surname, "Geçerli soyisim");
    userEvent.type(email, "gecerlimail@gecerli.com");
    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(() => {
        const error = screen.queryAllByTestId("error");
        expect(error).toHaveLength(0);
        const firstnameDisplay = screen.getByTestId("firstnameDisplay");
        const lastnameDisplay = screen.getByTestId("lastnameDisplay");
        const emailDisplay = screen.getByTestId("emailDisplay");
        const messageDisplay = screen.queryByTestId("messageDisplay");
        expect(firstnameDisplay).toHaveTextContent("Geçerli isim");
        expect(lastnameDisplay).toHaveTextContent("Geçerli soyisim");
        expect(emailDisplay).toHaveTextContent("gecerlimail@gecerli.com");
        expect(messageDisplay).not.toBeInTheDocument();
    })

});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const name = screen.getByTestId("name");
    const surname = screen.getByTestId("surname");
    const email = screen.getByTestId("email");
    const message = screen.getByTestId("message");
    userEvent.type(name, "Geçerli isim");
    userEvent.type(surname, "Geçerli soyisim");
    userEvent.type(email, "gecerlimail@gecerli.com");
    userEvent.type(message, "benim mesajım");
    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(() => {
        const error = screen.queryAllByTestId("error");
        expect(error).toHaveLength(0);
        const firstnameDisplay = screen.getByTestId("firstnameDisplay");
        const lastnameDisplay = screen.getByTestId("lastnameDisplay");
        const emailDisplay = screen.getByTestId("emailDisplay");
        const messageDisplay = screen.getByTestId("messageDisplay");
        expect(firstnameDisplay).toHaveTextContent("Geçerli isim");
        expect(lastnameDisplay).toHaveTextContent("Geçerli soyisim");
        expect(emailDisplay).toHaveTextContent("gecerlimail@gecerli.com");
        expect(messageDisplay).toHaveTextContent("benim mesajım");
    })
});
