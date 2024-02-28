import React, {useCallback, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Button, InputBox, Select,Loader, RTE} from './index'
import appwriteService from '../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [loading, setLoading] = useState(false)

    const submit = async (data) => {
        setLoading(true)
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                setLoading(false)
                navigate(`/post/${post.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                try {
                    let dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.$id
                    })
                    if(dbPost){
                        navigate(`/post/${dbPost.$id}`)
                    }
                } catch (error) {
                    prompt(error.message)
                } finally {setLoading(false)}
            }
            
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-full lg:w-2/3 px-2">
                <InputBox
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <InputBox
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-full lg:w-1/3 px-2">
                <InputBox
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                {loading? 
                    <div className='w-full grid place-items-center'> <Loader></Loader></div>
                    :
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className= {` ${post? "  hover:shadow-green-500 " : " hover:shadow-[#5ce1e6] cyan-button"} text-black shadow-sm hover:cursor-pointer duration-200 hover:drop-shadow-2xl rounded-lg w-full`} >
                    {post ? "Update" : "Submit"}
                </Button>}
            </div>
        </form>
    );
}