import Card from './Card/Card.jsx'
import { posts } from '../data/posts.js'
import Tags from './Tags/Tags.jsx'
import { useState } from 'react'

// mi creo l'oggetto con i dati iniziali del form
// che poi diventerà variabile di stato, per essere aggiornata con i dati ricevuti dal form

const InitialFormData = {
    title: '',
    image: undefined,
    author: '',
    category: '',
    content: '',
    tags: [],
    published: true,
}

export default function Main() {
    const uniqueTags = []
    for (const post of posts) { // per ogni post dell'array di oggetti posts
        for (const tag of post.tags) { // per ogni array di tags di ogni post
            if (!uniqueTags.includes(tag)) {
                uniqueTags.push(tag) // se il tag se non è già presente lo pusho
            }
        }
    }

    // variabile di stato per il form, con valore di partenza i campi vuoti
    const [formData, setFormData] = useState(InitialFormData)

    const [post, setPost] = useState(posts)  // variabile di stato per aggiungere un nuovo post all'array originale

    // funzione per gestire i campi del form
    function handleFormData(event) {
        const key = event.target.name  // elemento (dinamico) che genera l'input 
        // const value = event.target.value // valore (dinamico) inserito nel form

        // se l'elemento che da l'imput è di tipo checkbox, la imposto su checkata, altrimenti prendo il valore di testo inserito nel form
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

        // Se il campo è 'tags', trasformo la stringa in un array
        const newValue = key === 'tags' ? value.split(',').map(tag => tag.trim()) : value


        // nuovo oggetto che contiene i campi del form di partenza 
        // più gli imput dinamici del form
        const newFormData = {
            ...formData,
            [key]: newValue,   // key va nelle graffe altrimenti verrebbe interpretato come una propiretà di nome key
        }

        // cambio la variabile di stato che contiene i dati di default del form
        // con i nuovi dati presi in imput
        setFormData(newFormData)
    }

    // funzione per aggiungere il nuovo post (con le variabili di stato)
    function addNewPost(event) {        // disattivo la pagina che si aggiorna da sola
        event.preventDefault()

        if (formData.title.trim() === '' || formData.author.trim() === '' || formData.content.trim() === '' || formData.category.trim() === '') return

        const newPost = {       // nuovo oggetto post
            id: Date.now(),
            ...formData
        }

        // aggiorno la variabile di stato con l'array originale e il nuovo post
        setPost([...post, newPost])
        // svuoto i campi dopo il submit, settando i dati iniziali (vuoti di default)
        setFormData(InitialFormData)
    }

    // funzione per cancellare i post
    function deletePost(postId) {
        setPost((prevPosts) => prevPosts.filter((post) => post.id !== postId))  // prendo l'array di post e lo ritorno tutto tranne quello il cui id è diverso da quello cliccato
    }


    const publishedPosts = post.filter((post) => post.published) // meglio fare con filter, per fare poi meno iterazioni dopo
    return (
        <>
            <main>
                <section className='posts_section'>
                    <div className='container'>
                        <h1 className='page-title'>Il mio blog</h1>

                        <form onSubmit={addNewPost} className='form'>
                            <h3 className='form-title'>Crea un nuovo post</h3>
                            <div>
                                <label htmlFor="title">Titolo</label>
                                <input
                                    id='title'
                                    type="text"
                                    onChange={handleFormData}
                                    placeholder='Nuovo titolo'
                                    value={formData.title}
                                    name='title' />
                            </div>
                            <div>
                                <label htmlFor="author">Autore</label>
                                <input
                                    id='author'
                                    type="text"
                                    onChange={handleFormData}
                                    placeholder='Nome autore'
                                    value={formData.author}
                                    name='author' />
                            </div>
                            <div>
                                <label htmlFor="content">Contenuto</label>
                                <input
                                    id='content'
                                    type="text"
                                    onChange={handleFormData}
                                    placeholder='Inserisci il contenuto'
                                    value={formData.content}
                                    name='content' />
                            </div>
                            <div>
                                <label htmlFor="image">Path immagine</label>
                                <input
                                    id='image'
                                    className='input-image'
                                    type='text'
                                    placeholder='Inserisci il path immagine'
                                    value={formData.image}
                                    name='image' />
                            </div>
                            <div>
                                <label htmlFor="category">Categoria</label>
                                <select
                                    id='category'
                                    className='select'
                                    value={formData.category}
                                    name='category'
                                    onChange={handleFormData}>
                                    <option value="" selected>Seleziona una categoria</option>
                                    <option value='informatica'>Informatica</option>

                                    <option value='cinema'>Cinema</option>
                                    <option value='videogame'>Videogame</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="tags">Tags</label>
                                <input
                                    id='tags'
                                    type='text'
                                    name='tags'
                                    onChange={handleFormData}
                                    placeholder='Inserisci i tag separati da virgola'
                                    value={formData.tags.join(', ')} // Trasforma l'array di tag in una stringa
                                />
                            </div>
                            <input className='submit' type="submit" value='Aggiungi' />
                        </form>
                        <div className='tags_stripe'>
                            < Tags tags={uniqueTags} />
                        </div>
                    </div>
                    <div className='container'>
                        {publishedPosts.length ? ( // Se ci sono post
                            <div className="row">
                                {publishedPosts.map((post) =>
                                    <div key={post.id} className="col-6">
                                        <Card
                                            image={post.image}
                                            title={post.title}
                                            tags={post.tags}
                                            author={post.author}
                                            category={post.category}
                                            content={post.content}
                                            onDelete={() => deletePost(post.id)}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>No posts available</p> // Se l'array `posts` è vuoto
                        )}
                    </div>
                </section>
            </main>
        </>
    )
}